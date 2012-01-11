class CommentsController < ApplicationController
  def create
    @group = Group.find(params[:group_id])
    @document = Document.find(params[:document_id])
    @comment = @document.comments.create(params[:comment])
    redirect_to group_document_path(@group, @document)
  end

  def show
    @comment = Comment.find(params[:id])

    respond_to do |format|
      format.html
      format.json { render json: @document }
    end
  end
end
