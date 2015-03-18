class CreateCards < ActiveRecord::Migration
  def change
    create_table :cards do |t|
      t.string :front
      t.string :back
      t.belongs_to :deck, index: true

      t.timestamps
    end
  end
end
