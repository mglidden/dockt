class DocumentsController < ApplicationController
  def create
    @group = Group.find(params[:group_id])
    @document = @group.documents.create(params[:document])
    redirect_to group_path(@group)
  end
  
  def show
    @group = Group.find(params[:group_id])
    @document = Document.find(params[:id])
    @comments = @document.comments

    respond_to do |format|
      format.html
      format.json { render json: @document }
    end
  end

  def index
    @group = Group.find(params[:group_id])
    
    respond_to do |format|
      format.html
      format.json { render json: @group.documents }
    end
  end
end
