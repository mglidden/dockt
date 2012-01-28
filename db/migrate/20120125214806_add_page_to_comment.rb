class AddPageToComment < ActiveRecord::Migration
  def change
    add_column :comments, :page, :int
  end
end
