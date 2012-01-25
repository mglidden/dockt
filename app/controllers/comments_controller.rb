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
    @groups = Group.find(:all, :order => 'created_at').reverse()
    @documents = @group.documents
    @document = Document.find(params[:document_id])
    @pages = []

    if current_user == nil or !current_user.can_access_id(@document.group_id)
      @groups = []
      @documents = []
      @comments = []
      @document = nil
    else
      @comments = @document.comments
      @groups = @groups.find_all{|g| current_user.can_access(g)}
      pages_cmd = IO.popen('ls public/docs/ | grep ' + params[:document_id] + '-')
      @pages = pages_cmd.readlines.collect { |file| '/docs/' + file[0..-2] }
      puts @pages
      @pages.sort_by! { |a,b|
        a.split('-')[1].to_i 
      }
    end

    respond_to do |format|
      format.html
      format.json { render json: @comments}
    end
  end
end
