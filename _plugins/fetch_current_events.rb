Jekyll::Hooks.register :site, :after_init do |site|
  require 'rest-client'
  response = RestClient.get('https://workshops.de/api/course/17/events')
  File.write('_data/events.json', response.body)

  response = RestClient.get('https://workshops.de/api/course/27/events')
  File.write('_data/events-react-native.json', response.body)
end
