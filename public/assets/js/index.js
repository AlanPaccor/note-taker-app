var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group");

var activeNote = {};

var fetchNotes = function() {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

var storeNote = function(note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

var deleteExistingNote = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  })
};

var displayActiveNote = function() {
  $saveNoteBtn.hide();

  if (typeof activeNote.id === "number") {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

var saveNoteData = function() {
  var newNote = {
    title: $noteTitle.val(),
    text: $noteText.val()
  };

  storeNote(newNote);
    retrieveAndRenderNotes();
    displayActiveNote();
};

var eraseClickedNote = function(event) {
  event.stopPropagation();

  var note = $(this).data('id');

  if (activeNote.id === note) {
    activeNote = {};
  }

  deleteExistingNote(note);
  retrieveAndRenderNotes();
  displayActiveNote();
};

var selectNoteForView = function() {
  activeNote = $(this).data();
  displayActiveNote();
};

var initiateNewNoteView = function() {
  activeNote = {};
  displayActiveNote();
};

var handleSaveBtnRendering = function() {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

var showNoteList = function(notes) {
  $noteList.empty();

  var noteItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    $li.data('id',i);

    var $span = $("<span>").text(note.title);
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note' data-id="+i+">"
    );

    $li.append($span, $delBtn);
    noteItems.push($li);
  }

  $noteList.append(noteItems);
};

var getAndRenderInitialNotes = function() {
  return fetchNotes().then(function(data) {
    showNoteList(data);
  });
};

$saveNoteBtn.on("click", saveNoteData);
$noteList.on("click", ".list-group-item", selectNoteForView);
$newNoteBtn.on("click", initiateNewNoteView);
$noteList.on("click", ".delete-note", eraseClickedNote);
$noteTitle.on("keyup", handleSaveBtnRendering);
$noteText.on("keyup", handleSaveBtnRendering);

getAndRenderInitialNotes();
