$(function() {
    get_list_classes();
    $('#add_class_form').on('submit', function() {
        submit_add_class($('#add_class_form').serializeArray());
        $('#add_class_form')[0].reset();
    });
});

function get_list_classes() {
    var url = "index.php?action=get_list_classes";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_list_classes(json_data);
        $('.modal').modal();
        $('select').select();
        select_teacher();
        select_grade();
    };
    $.get(url, success);
}

function show_list_classes(data) {
    var list = $('#list_classes');
    for (var i = 0; i < data.length; i++) {
        var tr = $('<tr class="fadeIn" id="class-' + data[i].class_id + '"></tr>');
        tr.append('<td class="">' + data[i].class_id + '</td>');
        tr.append('<td class="">' + data[i].class_name + '</td>');
        tr.append('<td class="">' + data[i].grade_detail + '</td>');
        tr.append('<td class="">' + data[i].teacher_name + '</td>');
        tr.append('<td class="">' + class_edit_button(data[i]) + '<br />' + class_del_button(data[i]) + '</td>');
        list.append(tr);
    };
    $("form").on('submit', function(event) {
        event.preventDefault();
    });
}

function class_edit_button(data) {
    return btn = '<a class="waves-effect waves-light btn modal-trigger" style="margin-bottom: 7px;" href="#edit-' + data.class_id + '">Sửa</a>' +
    '<div id="edit-' + data.class_id + '" class="modal modal-edit">' +
    '<div class="row col l12">' +
    '<form action="" method="POST" role="form" onsubmit="submit_edit_class(this.id)" id="form-edit-class-' + data.class_id + '">' +
    '<div class="modal-content"><h5>Sửa Thông Tin: ' + data.class_name + '</h5>' +
    '<div class="modal-body">' +
    '<div class="col l12 s12">' +
    '<div class="input-field">' +
    '<input type="hidden" value="' + data.class_id + '" name="class_id">' +
    '<input type="text" value="' + data.class_name + '" name="class_name" readonly>' +
    '<label for="name" class="active">Tên Lớp</label>' +
    '</div>' +
    '<div class="input-field">' +
    '<select name="grade_id" onchange="test(this.value)">' +
    '</select>' +
    '<label>Khối</label>' +
    '</div>' +
    '<div class="input-field">' +
    '<select name="teacher_id" onchange="test(this.value)">' +
    '</select>' +
    '<label>Gíao Viên</label>' +
    '</div>'+
    '</div>' +
    '</div></div>' +
    '<div class="modal-footer">' +
    '<a href="#" class="waves-effect waves-green btn-flat modal-action modal-close">Trở Lại</a>' +
    '<button type="submit" class="waves-effect waves-green btn-flat">Đồng Ý</button>' +
    '</div></form></div></div>';
}

function class_del_button(data) {
    return btn = '<a class="waves-effect waves-light btn modal-trigger" href="#del-' + data.class_id + '">Xóa</a>' +
    '<div id="del-' + data.class_id + '" class="modal"><div class="modal-content">' +
    '<h5>Cảnh Báo</h5><p>Xác nhận xóa ' + data.class_name + '</p></div>' +
    '<form action="" method="POST" role="form" onsubmit="submit_del_class(this.id)" id="form-del-class-' + data.class_id + '">' +
    '<div class="modal-footer"><a href="#" class="waves-effect waves-green btn-flat modal-action modal-close">Trờ Lại</a>' +
    '<input type="hidden" value="' + data.class_id + '" name="class_id">' +
    '<button type="submit" class="waves-effect waves-green btn-flat modal-action modal-close">Đồng Ý</button></div></form></div>';
}

function submit_add_class(data) {
    var url = "index.php?action=check_add_class";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_status(json_data);
        if (json_data.status) {
            console.log(json_data);
            class_insert_data(json_data);
            $('.modal').modal();
            $('select').select();
            select_teacher();
            select_grade();
        }
    };
    $.post(url, data, success);
}

function submit_del_class(data) {
    data = $('#' + data).serializeArray();
    var url = "index.php?action=check_del_class";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_status(json_data);
        if (json_data.status) {
            console.log(json_data.class_id);
            $('#class-' + json_data.class_id).hide('400', function() {
                this.remove();
                console.log('remove');
            });
        }
    };
    $.post(url, data, success);
}

function submit_edit_class(data) {
    form = $('#' + data);
    data = $('#' + data).serializeArray();
    var url = "index.php?action=check_edit_class";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_status(json_data);
        if (json_data.status) {
            $('#class-' + json_data.class_id).remove();
            class_insert_data(json_data);
            form[0].reset();
            select_teacher();
            select_grade();
            $('.modal').modal();
            $('select').select();
        }
    };
    $.post(url, data, success);
}

function class_insert_data(data) {
    var list = $('#list_classes');
    var tr = $('<tr class="fadeIn" id="class-' + data.class_id + '"></tr>');
    tr.append('<td class="">' + data.class_id + '</td>');
    tr.append('<td class="">' + data.class_name + '</td>');
    tr.append('<td class="">' + data.grade_detail + '</td>');
    tr.append('<td class="">' + data.teacher_name + '</td>');
    tr.append('<td class="">' + class_edit_button(data) + '<br />' + class_del_button(data) + '</td>');
    list.append(tr);
    $("form").on('submit', function(event) {
        event.preventDefault();
    });
}


function valid_class_name(value) {
    var url = "index.php?action=valid_class_name";
    var data = {
        class_name: value
    }
    var success = function(result) {
        var json_data = $.parseJSON(result);
        if (json_data.status) {
            $('#valid-class-true').removeClass('hidden');
            $('#valid-class-false').addClass('hidden');
        } else {
            $('#valid-class-false').removeClass('hidden');
            $('#valid-class-true').addClass('hidden');
        }
    };
    $.get(url, data, success);
}

function select_teacher () {
    var url = "index.php?action=get_list_teachers";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        var sl = $('select[name=teacher_id]');
        sl.empty();
        $.each(json_data, function(key, value) {
            sl.append('<option value="'+value.teacher_id+'">'+value.name+'</option>');
        });
        $('select').select();
    };
    $.get(url, success);
}

function select_grade () {
    var url = "index.php?action=get_list_grades";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        var sl = $('select[name=grade_id]');
        sl.empty();
        $.each(json_data, function(key, value) {
            sl.append('<option value="'+value.grade_id+'">'+value.detail+'</option>');
        });
        $('select').select();
    };
    $.get(url, success);
}
