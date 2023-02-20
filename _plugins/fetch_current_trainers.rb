Jekyll::Hooks.register :site, :after_init do |site|
  require 'rest-client'
  if(ENV["JEKYLL_ENV"] != "local") then
    puts "Fetching trainers..."

    response = RestClient.get('https://workshops.de/api/portal/reactjs-de/trainers')
    File.write('_data/trainers.json', response.body)

    response = RestClient.get('https://workshops.de/api/course/32/trainers')
    File.write('_data/course_trainers/react.json', response.body)

    response = RestClient.get('https://workshops.de/api/course/27/trainers')
    File.write('_data/course_trainers/react-native.json', response.body)

    puts "Fetching trainers...done"
  end
end
