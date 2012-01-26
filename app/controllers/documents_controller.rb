class DocumentsController < ApplicationController
  def create
    @group = Group.find(params[:group_id])

    unless current_user.can_access(@group)
      return
    end

    @document = @group.documents.create(params[:document])
    @doc = @document
    respond_to do |format|
      format.html { render 'documents/_document_table_row.html.erb', :layout => false}
    end
  end

  def new
    @groups = Group.all
    @group = Group.find(params[:group_id])
    @document = Document.new

    unless current_user != nil
      return
    end

    @group.touch

    render :layout => false
  end
  
  def show 
    @groups = Group.all
    @group = Group.find(params[:group_id])
    @pages =[]
    unless current_user.can_access(@group)
      return
    end
    @documents = @group.documents
    @document = Document.find(params[:id])
    @comments = @document.comments
    pages_cmd = IO.popen('ls public/docs/ | grep ' + params[:id] + '-')
    @pages = pages_cmd.readlines.collect { |file| ['/docs/' + file[0..-2], file.split('-')[1].to_i] }
    @pages.sort_by! { |url, filenum|
      filenum
    }

    render :layout => false
  end

  def index
    @groups = Group.find(:all, :order => 'created_at').reverse()
    @group = Group.find(params[:group_id])
    if current_user == nil or !current_user.can_access(@group)
      @documents = []
      @groups = []
    else
      @documents = @group.documents
      @groups = @groups.find_all{|g| current_user.can_access(g)}
    end
    
    respond_to do |format|
      format.html
      format.json { render json: @documents }
    end
  end

  def destroy
    @document = Document.find(params[:id])
    @document.destroy

    respond_to do |format|
      format.html { render :inline => "#doc" + @document.id.to_s }
      format.json {head :ok}
    end
  end

  def delete
    @group = Group.find(params[:group_id])
    @documents = @group.documents
    render 'documents/delete', :layout => false
  end

  def pdf
    @document = Document.find(params[:document_id])
    render 'documents/pdf', :layout => false
  end
end
