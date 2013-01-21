function validate() {
	if($("#inputName").val() == "") {
		alert("plaese enter a group name");
		return false;
	}
	if($("#inputAltitude").val() == ""){
		alert("please enter a value for altitude");
		return false;
	}
	if(!isNumeric($("#inputAltitude").val())) {
		alert("Invalid value for altitude");
		return false;
	}
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}