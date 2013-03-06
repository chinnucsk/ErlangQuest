var logpos_timestamp = 0;

function init() {
    //test();
    socket = new io.Socket(location.hostname);
    socket.on('connect', function(){
            console.log("Connected.");
            socket.send({type: "replay", from:logpos_timestamp});
            console.log("Sent replay request.");
        });

    socket.on('message', function(data){
            console.log("Got message: "+JSON.stringify(data));

            if (data.timestamp == undefined ||
                data.timestamp <= logpos_timestamp) {
                return; // Not a log event.
            } else {
                console.log("Logpos change: "+logpos_timestamp+" -> "+data.timestamp);
                logpos_timestamp = data.timestamp;
            }

            if (data.type == "achieved") {
                var p = getPlayerByName(data.user);
                p.score += data.points;
                updatePoints(p);
                //getQuestByName(data.quest);
                getQuestCell(p, data.quest).text('X');
                addEventToList(data.user+" solved "+data.quest+" ("+data.variants+")");
            }
        });
    socket.connect();
}

//========== Player Model ========================================
function Collection() {
    this.elements = {};
    this.count = 0;
    this.get = function(k) {return this.elements.hasOwnProperty(k)
                            ? this.elements[k]
                            : null;}
    this.put = function(k,v) {if (!this.elements.hasOwnProperty(k)) this.count+=1;
                              this.elements[k] = v;
                              return v;}
    this.size = function() {return this.count;}
    this.foreach = function(f) {for (k in this.elements) f(k,this.elements[k]); }
}

var players = new Collection();
var quests = new Collection();

function getPlayerByName(name) {
    var p = players.get(name);
    if (p) return p;
    return players.put(name, {
        name: name,
        score: 0,
        ach_row: createAchRowForPlayer(name)
    });
}

function getQuestByName(name) {
    var q = quests.get(name);
    if (q) return q;

    var nr = quests.size()+1;
    return quests.put(name, {
        name: name,
        nr: nr,
        headercell: createColumnForQuest(name)
    });
}

/** Return the header cell */
function createColumnForQuest(name) {
    var newTH = $("div#templates th#quest_header_field").clone();
    var node = $(newTH);
    for (var i=0; i<name.length; i++) {
        var divNode = document.createElement("div");
        var c = name.charAt(i);
        if (c=="_") c="|\xA0"; else $(divNode).addClass("rot90");
        divNode.appendChild(document.createTextNode(c));
        node.append(divNode);
    }
    $("th#filler_header").before(newTH);
    if (! $(newTH).prev().hasClass("odd")) $(newTH).addClass("odd");
    newTH.hide().fadeIn(400);

    // Expand player rows:
    var src_td = achievementCellSrc();
    players.foreach(function(_name,p) {
        $(p.ach_row).append(src_td.clone());
    });

    return newTH;
}

/** Return the row */
function createAchRowForPlayer(name) {
    var newRow = $("div#templates tr#player_row").clone();
    $("#name_field", newRow).text(name);
    $("#score_field", newRow).text(0);

    // Add a cell for each quest:
    var td_src = achievementCellSrc();
    for (var i=0; i<quests.size(); i++) {
        $(newRow).append(td_src.clone());
    }

    $("table#player_table").append(newRow);
    newRow.hide().fadeIn(400);
    return newRow;
}

function updatePoints(player) {
    var row = player.ach_row;
    var scoreField = $('#score_field', row);
    scoreField.text(player.score);
    //scoreField.animate({color: "#FFF"}, 100, "swing", function(){scoreField.animate({color: "#000"}, 500)})

    // Maintain sorting by score:
    var prevRow;
    while ((prevRow = $(row).prev()) &&
           parseInt($('#score_field',prevRow).text()) < player.score)
    {
        $(row).after(prevRow.remove());
    }
}

function getQuestCell(player, questName) {
    var quest = getQuestByName(questName);
    var cell = $('#name_field', player.ach_row);
    var nr = quest.nr;
    for (var i=0; i<nr; i++) cell=cell.next();
    return cell;
}

function achievementCellSrc() {
    return $('#templates #achievement_field');
}

function addEventToList(eventText) {
    var newLI = $('#templates #event_entry').clone();
    var list = $('ul#event_list');
    list.prepend(newLI.text(eventText));
}

// Test:
function test() {
  var f = function(f,i) {
    createRowForPlayer("Player "+i);
    if (i<10) setTimeout(function() {f(f,i+1)}, 500)
  }
  f(f,2);
}
