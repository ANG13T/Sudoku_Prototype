function StopWatch(elem){
    var time = 0;
    var interval;
    var offset;

    function update(){ //adds delta onto time
        time += delta();
        var formattedTime = timeFormatter(time);
        console.log(formattedTime);
        elem.text(formattedTime);
    }
    function delta(){
        var now = Date.now();
        var timePassed = now - offset; //gets diff btwn offset and now to get time passed
        offset = now;
        return timePassed;
    }
    function timeFormatter(milliTime){
        var time = new Date(milliTime);
        var min = time.getMinutes().toString();
        var secs = time.getSeconds().toString();

        if(min.length < 2){
            min = "0" + min;
        }

        if(secs.length < 2){
            secs = "0" + secs;
        }
        return min + " : " + secs;
    }

    this.isOn = false;

    this.start = function(){
        if(!this.isOn){ //if it is not on
            interval = setInterval(update, 10); //calls update every 10 secs
            offset = Date.now();
            this.isOn = true; //sets the watch on
        }
    }

    this.stop = function(){
        if(this.isOn){
            clearInterval(interval);
            interval = null;
            this.isOn = false;
        }
    }
}