require 'pusher'

Pusher.app_id = '14401'
Pusher.key = 'ab37b6148d60ea118769'
Pusher.secret = 'cbf525b2c7445541cd08'

class GroupsController < ApplicationController
  # GET /groups
  # GET /groups.json
  def index
    if current_user != nil
      @groups = Group.find(:all, :order => 'updated_at').reverse().find_all{|g| g.visible or g.visible == nil}
      viewable_groups = current_user.viewable_groups.find_all{|g| g.visible or g.visible == nil}
    else
      @groups = []
      viewable_groups = []
      redirect_to :controller => :home, :action => :index
      return
    end

    if viewable_groups.length == 0
      @group_alert = 'You have not created any groups yet. To begin, click on the plus icon to the right.'
    end

    use_layout = true
    if params[:layout] == 'false'
      use_layout = false
    end

    respond_to do |format|
      format.html { render :layout => use_layout }# index.html.erb
      format.json { render json: viewable_groups}
    end
  end

  # GET /groups/1
  # GET /groups/1.json
  def show
    @group = Group.find(params[:id])
    @groups = Group.find(:all, :order => 'updated_at').reverse().find_all{|g| g.visible or g.visible == nil}
    @documents = @group.documents.sort_by {|doc| doc.updated_at }.reverse().find_all {|d| d.visible or d.visible == nil}

    if current_user == nil
      redirect_to :controller => :home, :action => :index
      return
    elsif !current_user.can_access(@group)
      return
    end

    if @documents.length == 0
      @doc_alert = 'You have not added any documents yet. To begin, click on the plus icon to the right and give us a link to a PDF.'
    end

    render :layout => false
  end

  # GET /groups/new
  # GET /groups/new.json
  def new
    @group = Group.new

    if current_user == nil
      redirect_to :controller => :home, :action => :index
      return
    end

    render :layout => false
  end

  # GET /groups/1/edit
  def edit
    @group = Group.find(params[:id])
  end

  # POST /groups
  # POST /groups.json
  def create
    if current_user == nil
      redirect_to :controller => :home, :action => :index
      return
    end

    @group = Group.new(params[:group])

    respond_to do |format|
      if @group.save
        format.html { render 'groups/_group_table_row.html.erb', :layout => false}
        format.json { render json: @group, status: :created, location: @group }
        current_user.add_access(@group)
        @group.set_editor(current_user)
      else
        format.html { render action: "new" }
        format.json { render json: @group.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /groups/1
  # PUT /groups/1.json
  def update
    @group = Group.find(params[:id])

    if current_user == nil
      redirect_to :controller => :home, :action => :index
      return
    elsif !current_user.can_access(@group)
      return
    end

    respond_to do |format|
      if @group.update_attributes(params[:group])
        format.html { redirect_to @group, notice: 'Group was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @group.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /groups/1
  # DELETE /groups/1.json
  def destroy
    @group = Group.find(params[:group][:id])

    if current_user == nil
      redirect_to :controller => :home, :action => :index
      return
    elsif !current_user.can_access(@group)
      return
    end

    data = {:namespace => 'toolbar', :method => 'removeTableRowHelper',
            :parm1 => '#group' + @group.id.to_s}
    @group.users_with_access.each do |user|
      if user != current_user
        user.send_message(data)
      end
    end

    @group.visible = false
    @group.save :validate => false

    data = {:namespace => 'alerts', :method => 'showWarning',
            :parm1 => 'You have deleted the group \'' + @group.name + '.\' <a onclick="$.ajax({url:\'/groups/' + @group.id.to_s + '/undo\'}); alerts.close()">[undo]</a>'}
    current_user.send_message(data)

    respond_to do |format|
      format.html { render :inline => "#group" + @group.id.to_s }
      format.json { head :ok }
    end
  end

  def delete
    if current_user == nil
      redirect_to :controller => :home, :action => :index
      return
    end

    @groups = Group.find(:all, :order => 'updated_at').reverse()
    @visible_groups = current_user.viewable_groups
    render 'groups/delete', :layout => false
  end

  def members
    if current_user == nil
      redirect_to :controller => :home, :action => :index
      return
    end

    @group = Group.find(params[:id])
    @groups = Group.find(:all, :order => 'updated_at').reverse()
    @visible_groups = current_user.viewable_groups
    @users = User.all
    render 'groups/members', :layout => false
  end

  def add_member
    if current_user == nil
      redirect_to :controller => :home, :action => :index
      return
    elsif !current_user.can_access_id(params[:group][:id])
      return
    end

    user = User.find_by_login(params[:login])
    if !user
      render :inline => "error"
      return
    end
    if !user.can_access_id(params[:group][:id])
      user.add_access_id(params[:group][:id])

      @group = Group.find(params[:group][:id])
      @group.touch
      @display_user = user
      data = {:parm2 => render(:partial => 'groups/group_table_row'),
              :namespace => 'toolbar', :method => 'addTableRowHelper',
              :parm1 => 'classes'};
      user.send_message(data)
    end

    respond_to do |format|
      format.json { head :ok }
    end
  end

  def undo
    @group = Group.find(params[:id])

    if current_user == nil
      redirect_to :controller => :home, :action => :index
      return
    elsif !current_user.can_access(@group)
      return
    end

    @group.visible = true
    @group.save :validate => false

    @group.users_with_access.each do |u|
      @display_user = u
      data = {:namespace => 'toolbar', :method => 'addTableRowHelper',
        :parm1 => 'classes',
        :parm2 => render_to_string(:partial => 'groups/group_table_row')}
      u.send_message(data)
    end

    render :inline => ''
  end
end
