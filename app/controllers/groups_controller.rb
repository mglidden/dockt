class GroupsController < ApplicationController
  # GET /groups
  # GET /groups.json
  def index
    if current_user != nil
      @groups = Group.all
      viewable_groups = @groups.find_all{|group| current_user.can_access(group)}
    else
      @groups = []
      viewable_groups = []
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
    @documents = @group.documents

    unless current_user.can_access(@group)
      return
    end

    render :layout => false
  end

  # GET /groups/new
  # GET /groups/new.json
  def new
    @group = Group.new

    unless current_user != nil
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
    unless current_user != nil
      return
    end

    @group = Group.new(params[:group])

    respond_to do |format|
      if @group.save
        format.html { render action: 'show'}
        format.json { render json: @group, status: :created, location: @group }
        current_user.add_access(@group)
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

    unless current_user.can_access(@group)
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
    @group.destroy

    unless current_user.can_access(@group)
      return
    end

    respond_to do |format|
      format.html { redirect_to groups_url }
      format.json { head :ok }
    end
  end
end
