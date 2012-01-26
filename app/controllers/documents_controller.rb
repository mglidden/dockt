class DocumentsController < ApplicationController
  def create
    @group = Group.find(params[:group_id])

    if current_user == nil
      redirect_to :controller => :sessions, :action => :new
      return
    elsif !current_user.can_access(@group)
      return
    end

    @document = @group.documents.create(params[:document])
    @group.touch
    @doc = @document
    @document.set_editor(current_user)
    respond_to do |format|
      format.html { render 'documents/_document_table_row.html.erb', :layout => false}
    end
  end

  def new
    @groups = Group.all
    @group = Group.find(params[:group_id])

    if current_user == nil
      redirect_to :controller => :sessions, :action => :new
      return
    elsif !current_user.can_access(@group)
      return
    end

    render :layout => false
  end
  
  def show 
    @groups = Group.find(:all, :order => 'updated_at').reverse()
    @group = Group.find(params[:group_id])
    @pages =[]

    if current_user == nil
      redirect_to :controller => :sessions, :action => :new
      return
    elsif !current_user.can_access(@group)
      return
    end

    @documents = @group.documents
    @document = Document.find(params[:id]).sort_by {|doc| doc.updated_at}.reverse()
    @comments = @document.comments
    pages_cmd = IO.popen('ls public/docs/ | grep ' + params[:id] + '-')
    @pages = pages_cmd.readlines.collect { |file| ['/docs/' + file[0..-2], file.split('-')[1].to_i] }
    @pages.sort_by! { |url, filenum|
      filenum
    }

    render :layout => false
  end

  def index
    @groups = Group.find(:all, :order => 'updated_at').reverse()
    @group = Group.find(params[:group_id])

    if current_user == nil
      redirect_to :controller => :sessions, :action => :new
      return
    elsif !current_user.can_access(@group)
      return
    end

    @documents = @group.documents.sort_by {|doc| doc.updated_at}.reverse()
    @groups = @groups.find_all{|g| current_user.can_access(g)}
    
    respond_to do |format|
      format.html
      format.json { render json: @documents }
    end
  end

  def destroy
    @group = Group.find(params[:group_id])

    if current_user == nil
      redirect_to :controller => :sessions, :action => :new
      return
    elsif !current_user.can_access(@group)
      return
    end

    @document = Document.find(params[:id])
    @document.destroy

    respond_to do |format|
      format.html { render :inline => "#doc" + @document.id.to_s }
      format.json {head :ok}
    end
  end

  def delete
    @group = Group.find(params[:group_id])

    if current_user == nil
      redirect_to :controller => :sessions, :action => :new
      return
    elsif !current_user.can_access(@group)
      return
    end

    @documents = @group.documents.sort_by {|doc| doc.updated_at }.reverse()
    render 'documents/delete', :layout => false
  end

  def pdf
    @group = Group.find(params[:group_id])

    if current_user == nil
      redirect_to :controller => :sessions, :action => :new
      return
    elsif !current_user.can_access(@group)
      return
    end

    @document = Document.find(params[:document_id])
    render 'documents/pdf', :layout => false
  end
end
