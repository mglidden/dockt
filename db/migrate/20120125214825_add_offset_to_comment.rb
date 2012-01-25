class AddOffsetToComment < ActiveRecord::Migration
  def change
    add_column :comments, :offset, :int
  end
end
