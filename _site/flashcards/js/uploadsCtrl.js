flashcards.controller('UploadsCtrl', ['$scope', '$http', '$filter', '$timeout', '$routeParams', '$location', 'Deck', function UploadsCtrl($scope, $http, $filter, $timeout, $routeParams, $location, Deck) {

  var currentDeck = new Deck({
    name: 'New Deck',
    cards: []
  });

  function xlsxworker(data, cb) {
    var worker = new Worker('./js/xlsxworker.js');
    worker.onmessage = function(e) {
      switch(e.data.t) {
        case 'ready': break;
        case 'e': console.error(e.data.d);
        case 'xlsx': cb(JSON.parse(e.data.d)); break;
      }
    };
    var arr = btoa(String.fromCharCode.apply(null, new Uint8Array(data)));
    worker.postMessage(arr);
  }

  function to_json(workbook) {
    var result = {};
    workbook.SheetNames.forEach(function(sheetName) {
      var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      if(roa.length > 0){
        result[sheetName] = roa;
      }
    });
    return result;
  }

  function to_csv(workbook) {
    var result = [];
    workbook.SheetNames.forEach(function(sheetName) {
      var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
      if(csv.length > 0){
        result.push("SHEET: " + sheetName);
        result.push("");
        result.push(csv);
      }
    });
    return result.join("\n");
  }

  function to_formulae(workbook) {
    var result = [];
    workbook.SheetNames.forEach(function(sheetName) {
      var formulae = XLSX.utils.get_formulae(workbook.Sheets[sheetName]);
      if(formulae.length > 0){
        result.push("SHEET: " + sheetName);
        result.push("");
        result.push(formulae.join("\n"));
      }
    });
    return result.join("\n");
  }

  function process_wb(wb) {
    var output = JSON.stringify(to_json(wb), 2, 2);
    addCards(to_json(wb)['Sheet1']);
    return;
    if(out.innerText === undefined) out.textContent = output;
    else out.innerText = output;
  }

  var drop = document.getElementById('drop');
  function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files;
    var i,f;
    for (i = 0, f = files[i]; i != files.length; ++i) {
      var reader = new FileReader();
      var name = f.name;
      currentDeck.name = name;
      reader.onload = function(e) {
        var data = e.target.result;
        if(typeof Worker !== 'undefined') {
            xlsxworker(data, process_wb);
        } else {
          //var wb = XLSX.read(data, {type: 'binary'});
          var arr = String.fromCharCode.apply(null, new Uint8Array(data));
          var wb = XLSX.read(btoa(arr), {type: 'base64'});
          process_wb(wb);
        }
      };
      //reader.readAsBinaryString(f);
      reader.readAsArrayBuffer(f);
    }
  }

  function handleDragover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  if(drop.addEventListener) {
    drop.addEventListener('dragenter', handleDragover, false);
    drop.addEventListener('dragover', handleDragover, false);
    drop.addEventListener('drop', handleDrop, false);
  }

  function addCards(cards) {
    console.log(cards)
    currentDeck.cards_attributes = cards;
    currentDeck.$save(function() {
      $scope.resetDecks();
    });
  }
}]);
