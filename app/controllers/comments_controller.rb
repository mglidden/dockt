class CommentsController < ApplicationController
  def create
    @group = Group.find(params[:group_id])

    if current_user == nil
      redirect_to :controller => :sessions, :action => :new
      return
    elsif !current_user.can_access(@grouP)
      return
    end

    @document = Document.find(params[:document_id])
    params[:comment][:commenter] = current_user.login
    @comment = @document.comments.create(params[:comment])
    respond_to do |format|
      format.html { render 'comments/_comment_table_row.html.erb', :layout => false}
    end
  end

  def new
    @groups = Group.all
    @group = Group.find(params[:group_id])

    if current_user == nil
      redirect_to :controller => :sessions, :action => :new
      return
    elsif !current_user.can_access(@grouP)
      return
    end

    @document = Document.find(params[:document_id])
    @comment = Comment.new
    @group.touch
    @document.touch
    @document.set_editor(current_user)
    render :layout => false
  end

  def show
    self.index
  end

  def index
    @group = Group.find(params[:group_id])

    if current_user == nil
      redirect_to :controller => :sessions, :action => :new
      return
    elsif !current_user.can_access(@grouP)
      return
    end

    @groups = Group.find(:all, :order => 'updated_at').reverse()
    @documents = @group.documents.sort_by {|doc| doc.updated_at}.reverse
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
      @pages = pages_cmd.readlines.collect { |file| ['/docs/' + file[0..-2], file.split('-')[1].to_i] }
      @pages.sort_by! { |url, filenum|
        filenum
      }
    end

    respond_to do |format|
      format.html
      format.json { render json: @comments}
    end
  end
end
