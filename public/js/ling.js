$('#lingSubmitButton').click(function(evt) {
    evt.preventDefault()
    $.ajax({
        type: 'POST',
        url: '/ling',
        data: {
            ling: $('#autoresizing').val()
        },
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                alert(data.ling)
            } else {
                console.log('bad')
            }
        },
        error: function() {
            console.log('error')
        }
    })
})