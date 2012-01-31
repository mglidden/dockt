class PusherController < ApplicationController
  protect_from_forgery :execpt => :auth

  def auth
    # hack. rewrite so its a channel per group, not a channel per user
#    if current_user != nil and 'private-updates-'+current_user.id.to_s == params[:channel_name]
    if current_user != nil
      response = Pusher[params[:channel_name]].authenticate(params[:socket_id])
      render :json => response
    else
      render :text => 'Not authorized', :status => '403'
    end
  end
end

