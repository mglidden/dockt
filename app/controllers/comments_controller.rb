class CommentsController < ApplicationController
  def create
    @group = Group.find(params[:group_id])

    unless current_user.can_access(@group)
      return
    end

    @document = Document.find(params[:document_id])
    @comment = @document.comments.create(params[:comment])
    redirect_to group_document_path(@group, @document)
  end

  def show
    @group = Group.find(params[:group_id])

    unless current_user.can_access(@group)
      return
    end

    @documents = @group.documents
    @comments = Document.find(params[:document_id]).comments
    @comment = Comment.find(params[:id])

    render :layout => false
  end

  def index
    @group = Group.find(params[:group_id])
    @groups = Group.all
    @documents = @group.documents
    @document = Document.find(params[:document_id])

    puts @document.group_id
    puts params[:document_id]
    puts params[:group_id]
    puts current_user.can_access_id(@document.group_id)
    puts '\n\n\n\n\n'

    if current_user == nil or !current_user.can_access_id(@document.group_id)
      @groups = []
      @documents = []
      @comments = []
      @document = nil
    else
      @comments = @document.comments
    end

    respond_to do |format|
      format.html
      format.json { render json: @comments}
    end
  end
end
