$(function() {
    var socket = io()
    $('form').submit(function(e) {
        e.preventDefault()
        socket.emit('chat message', $('#message').val())
        $('#message').val('')
        return false
    })
    socket.on('message', function(msg) {
        $('#display_msg').append($('<p>').text(msg))
    })
})