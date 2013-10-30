class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :title
      t.datetime :starts_at
      t.datetime :ends_at
      t.text :notes
      t.string :location
      t.string :color

      t.timestamps
    end
  end
end
