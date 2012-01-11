class CommentsController < ApplicationController
  def show
    @comment = Comment.find(params[:id])

    respond_to do |format|
      format.html
      format.json { render json: @document }
    end
  end
end
