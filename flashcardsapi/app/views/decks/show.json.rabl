object @deck

attributes :id, :name
child :cards do
  attributes :id, :front, :back
end
