class RemoveLocationToComment < ActiveRecord::Migration
  def up
    remove_column :comments, :location
  end

  def down
    add_column :comments, :location, :int
  end
end
