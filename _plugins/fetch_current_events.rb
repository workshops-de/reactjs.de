Jekyll::Hooks.register :site, :after_init do |site|
  require 'rest-client'
  if(ENV["JEKYLL_ENV"] != "local") then
    puts "Fetching events..."

    response = RestClient.get('https://workshops.de/api/course/32/events')
    File.write('_data/events/react.json', response.body)

    response = RestClient.get('https://workshops.de/api/course/32/related-events')
    File.write('_data/related_events/react.json', response.body)

    response = RestClient.get('https://workshops.de/api/course/27/events')
    File.write('_data/events/react-native.json', response.body)

    response = RestClient.get('https://workshops.de/api/course/27/related-events')
    File.write('_data/related_events/react-native.json', response.body)

    puts "Fetching events...done"
  end
end
