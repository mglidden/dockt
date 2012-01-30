Docs::Application.routes.draw do
  resources :users

  match 'session' => 'sessions#create'

  resource :session, :only => [:new, :create, :destroy]

  match 'signup' => 'users#new', :as => :signup

  match 'register' => 'users#create', :as => :register

  match 'login' => 'sessions#new', :as => :login

  match 'logout' => 'sessions#destroy', :as => :logout

  match '/activate/:activation_code' => 'users#activate', :as => :activate, :activation_code => nil

  match '/groups/delete' => 'groups#delete'
  match '/groups/destroy' => 'groups#destroy'
  match '/groups/members' => 'groups#members'
  match '/groups/add_members' => 'groups#add_member'

  match '/groups/:group_id/documents/delete' => 'documents#delete'
  match '/groups/:group_id/documents/destroy' => 'documents#destroy'
  match '/groups/:group_id/documents/:document_id/pdf' => 'documents#pdf'
  match '/groups/:group_id/documents/:id/undo' => 'documents#undo'
  match '/groups/:id/undo' => 'groups#undo'

  get 'users/autocomplete_users_login'
  match '/terms' => 'application#search_list'
  match '/search/:query' => 'application#query'
  match '/pusher/auth' => 'pusher#auth'
  match '/user_bar' => 'sessions#bar'

  resources :groups do
    resources :documents do
      resources :comments
    end
  end

  get "home/index"

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => 'home#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
