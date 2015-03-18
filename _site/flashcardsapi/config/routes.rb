Flashcardsapi::Application.routes.draw do
  resources :decks, defaults: { format: 'json' }
  match '/decks' => 'decks#options', :constraints => {:method => 'OPTIONS'}, via: [:options]
  match '/decks/:deck_id' => 'decks#options', :constraints => {:method => 'OPTIONS'}, via: [:options]
end
