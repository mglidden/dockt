class RemoveGroupsFromUser < ActiveRecord::Migration
  def up
    remove_column :users, :groups
  end

  def down
    add_column :users, :groups, :string
  end
end
