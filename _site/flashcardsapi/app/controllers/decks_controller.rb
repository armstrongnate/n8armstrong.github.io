class DecksController < ApplicationController
  respond_to :json
  before_filter :set_headers
  protect_from_forgery with: :null_session

  def index
    # sleep 3.0
    @decks = Deck.all
  end

  def show
    @deck = Deck.find(params[:id])
    respond_with @deck
  end

  def create
    @deck = Deck.new(safe_params)
    @deck.save
    respond_with @deck
  end

  def update
    @deck = Deck.find(params[:id])
    @deck.update_attributes(safe_params)
    respond_with @deck
  end

  def destroy
    @deck = Deck.find(params[:id])
    @deck.destroy
    respond_with @deck
  end

  def options
    set_headers
    # this will send an empty request to the clien with 200 status code (OK, can proceed)
    render :text => '', :content_type => 'text/plain'
  end

  private

  # Set CORS
  def set_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Expose-Headers'] = 'Etag'
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD'
    headers['Access-Control-Allow-Headers'] = '*, x-requested-with, Content-Type, If-Modified-Since, If-None-Match'
    headers['Access-Control-Max-Age'] = '86400'
  end

  def safe_params
    safe_attributes = [
      :id,
      :name,
      cards_attributes: [
        :front,
        :back,
        :id,
        :_destroy,
      ],
    ]
    params.permit(*safe_attributes)
  end
end
