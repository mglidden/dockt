class CommentsController < ApplicationController
  def create
    @document = Document.find(params[:document_id])
    @comment = @document.comments.create(params[:comment])
    redirect_to document_path(@document)
  end

  def show
    @comment = Comment.find(params[:id])

    respond_to do |format|
      format.html
      format.json { render json: @document }
    end
  end
end
