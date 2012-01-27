class GroupsController < ApplicationController
  # GET /groups
  # GET /groups.json
  def index
    if current_user != nil
      @groups = Group.find(:all, :order => 'updated_at').reverse()
      viewable_groups = @groups.find_all{|group| current_user.can_access(group)}
    else
      @groups = []
      viewable_groups = []
      redirect_to :controller => :sessions, :action => :new
      return
    end

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: viewable_groups}
    end
  end

  # GET /groups/1
  # GET /groups/1.json
  def show
    @group = Group.find(params[:id])
    @groups = Group.all
    @documents = @group.documents.sort_by {|doc| doc.updated_at }.reverse()

    if current_user == nil
      redirect_to :controller => :sessions, :action => :new
      return
    elsif !current_user.can_access(@group)
      return
    end

    render :layout => false
  end

  # GET /groups/new
  # GET /groups/new.json
  def new
    @group = Group.new

    if current_user == nil
      redirect_to :controller => :sessions, :action => :new
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
      redirect_to :controller => :sessions, :action => :new
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
      redirect_to :controller => :sessions, :action => :new
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
    @group = Group.find(params[:id])

    if current_user == nil
      redirect_to :controller => :sessions, :action => :new
      return
    elsif !current_user.can_access(@group)
      return
    end

    @group.destroy

    respond_to do |format|
      format.html { render :inline => "#group" + @group.id.to_s }
      format.json { head :ok }
    end
  end

  def delete
    if current_user == nil
      redirect_to :controller => :sessions, :action => :new
      return
    end

    @groups = Group.find(:all, :order => 'updated_at').reverse()
    @visible_groups = @groups.find_all{|group| current_user.can_access(group)}
    render 'groups/delete', :layout => false
  end

  def members
    if current_user == nil
      redirect_to :controller => :sessions, :action => :new
      return
    end

    @groups = Group.find(:all, :order => 'updated_at').reverse()
    @visible_groups = @groups.find_all{|group| current_user.can_access(group)}
    @users = User.all
    render 'groups/members', :layout => false
  end

  def add_member
    @group = Group.find(params[:id])

    if current_user == nil
      redirect_to :controller => :sessions, :action => :new
      return
    elsif !current_user.can_access(@group)
      return
    end

    User.find_by_login(params[:login]).add_access_id(params[:id])

    respond_to do |format|
      format.json { head :ok }
    end
  end

end
