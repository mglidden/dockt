class DocumentsController < ApplicationController
  def create
    @group = Group.find(params[:group_id])
    @document = @group.documents.create(params[:document])
    redirect_to group_path(@group)
  end
end
