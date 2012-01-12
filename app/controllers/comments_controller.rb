class CommentsController < ApplicationController
  def create
    @group = Group.find(params[:group_id])
    @document = Document.find(params[:document_id])
    @comment = @document.comments.create(params[:comment])
    redirect_to group_document_path(@group, @document)
  end

  def show
    @group = Group.find(params[:group_id])
    @documents = @group.documents
    @comments = Document.find(params[:document_id]).comments
    @comment = Comment.find(params[:id])

    respond_to do |format|
      format.html
      format.json { render json: @comment }
    end
  end

  def index
    @group = Group.find(params[:group_id])
    @documents = @group.documents
    @document = Document.find(params[:document_id])
    @comments = @document.comments


    respond_to do |format|
      format.html
      format.json { render json: @document.comments }
    end
  end
end
