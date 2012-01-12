class FixColumnNames < ActiveRecord::Migration
  def change
    change_table :groups do |t|
      t.rename :modified, :creator
    end
  end
end