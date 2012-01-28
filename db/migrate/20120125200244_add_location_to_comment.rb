class AddLocationToComment < ActiveRecord::Migration
  def change
    add_column :comments, :location, :int
  end
end
