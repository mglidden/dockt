class HomeController < ApplicationController
  def index
    if current_user != nil
      redirect_to :controller => :groups, :action => :index
    end
  end
end
