/**
 * Collection of functions that handle
 *
 * @author Heckel (edited 02/24/18)
 */

/**
 * Setup and removal of the description field for
 * the second param based on the value of the first param
 *
 * @param numberField       HTML Field
 * @param descriptionField  HTML Field
 */
function OtherChange(numberField, descriptionField){
    var num = numberField;
    var desc = descriptionField;

    // check to see if other field has a value
    if(parseInt($(num).val()) > 0) {
        // setup the html for the description field
        if(!$(desc).parent().next().is("br")) {
            $(desc).parent().after("<br>");
        }
        $(desc).parent().show();

        // make the description field 'required'
        if($(desc).next().html().indexOf(" *") < 0)
            $(desc).next().html($(desc).next().html()+" *");
        $(desc).addClass('required');
    } else {
        // remove possible 'required' tags if value changes back to zero
        $(desc).next().html($(desc).next().html().replace(" *",""));
        $(desc).removeClass('required');
        $(desc).parent().removeClass('is-dirty');
        $(desc).val("");

        // remove setup for description field
        if($(desc).parent().next().is("br"))
            $(desc).parent().next().remove();
        $(desc).parent().hide();
    }
}

/**
 * Setup and removal of the description field for
 * the second param based on the status of the first param
 *
 * @param otherField        HTML Field
 * @param descriptionField  HTML Field
 */
function OtherCheckbox(otherField,descriptionField) {
    var other = otherField;
    var desc = descriptionField;

    // check if other field is selected
    if($(other).get()[0].checked){
        // setup the html for the description field
        if(!$(desc).parent().next().is("br"))
            $(desc).parent().after("<br>");
        $(desc).parent().show();

        // make the description field 'required'
        $(desc).addClass('required');
    } else {
        // remove possible 'required' tages if the field becomes unselected
        $(desc).removeClass('required');
        $(desc).parent().removeClass('is-dirty');
        $(desc).val("");

        // remove setup for description field
        if($(desc).parent().next().is("br"))
            $(desc).parent().next().remove();
        $(desc).parent().hide();
    }
}

/**
 * Setup and removal of the description field for
 * rainfall based on it html attributes
 */
function RainfallChange(){
    if(parseFloat($('#RAINFALL').val()) > 0){
        if(!$('#RAINFALL_STN_DESC').is(':visible')) {
            $('#RAINFALL_STN_DESC').parent().removeClass('is-dirty');
            $('#RAINFALL_STN_DESC').val("");
        }

        // setup the html for the description field
        if(!$('#RAINFALL_STN_DESC').parent().next().is("br"))
            $('#RAINFALL_STN_DESC').parent().after("<br>");
        $('#RAINFALL_STN_DESC').parent().show();
    } else {
        // remove possible 'required' tags if the field becomes unselected
        $('#RAINFALL_STN_DESC').next().next().html($('#RAINFALL_STN_DESC').next().next().html().replace(" *",""));
        $('#RAINFALL_STN_DESC').parent().addClass('is-dirty');
        $('#RAINFALL_STN_DESC').val("Other");

        // remove setup for description field
        if($('#RAINFALL_STN_DESC').parent().next().is("br"))
            $('#RAINFALL_STN_DESC').parent().next().remove();
        $('#RAINFALL_STN_DESC').parent().hide();
    }
}

/**
 * Set the value of Wind Disc based
 * on the wind degrees input
 */
function AlterWindDirDesc() {
    var cur = $("#WIND_DIR_DEGREES").val();
    // '', 'Calm', 'Variable','N','NE','E','SE','S','SW','W','NW'
    // "(0*3[0-5][0-9])|(0*[1-2][0-9][0-9])|(0*[1-9][0-9])|(0*[1-9])|0*"
    var v = 45/2.0;
    var N   = cur >= 360-v  ||   cur < v;
    var NE  = cur >= v      ||   cur < 45+v;
    var E   = cur >= 45+v  ||   cur < 90+v;
    var SE  = cur >= 90+v  ||   cur < 180-v;
    var S   = cur >= 180-v  ||   cur < 180+v;
    var SW  = cur >= 180+v  ||   cur < 11.25;
    var W   = cur >= 348.75  ||   cur < 11.25;
    var NW  = cur >= 348.75  ||   cur < 11.25;

    var res;    // RESULTS

    // Alter WIND_DIR_DESC
    if ( cur == null || cur == '') {
        // There is nothing
        res = 'Calm' // '' and 'Variable' shouldn't be sent
    } else if (N) {
        res = 'N';
    } else if (NE) {
        res = 'NE';
    } else if (E) {
        res = 'E';
    } else if (SE) {
        res = 'SE';
    } else if (S) {
        res = 'SW';
    } else if (SW) {
        res = 'SW';
    } else if (W) {
        res = 'W';
    } else if (NW) {
        res = 'NW';
    } else {
        // This shouldnt happen!!
        res = 'Variable';
    }

    // Conform degrees to cardinal directions
    $("#WIND_DIR_DESC").val(res);
} // WIND_DIR_DEGREES

/**
 * Setup and removal of the description field for
 * odor based on its html attributes
 */
function OdorChange() {
    if($("#ODOR_DESCRIPTION").val() == 'Other'){
        // setup the html for the description field
        if(!$('#ODOR_OTHER_DESCRIPTION').parent().next().is("br"))
            $('#ODOR_OTHER_DESCRIPTION').parent().after("<br>");
        $("#ODOR_OTHER_DESCRIPTION").parent().show();
    } else {
        // remove setup for description field
        if($('#ODOR_OTHER_DESCRIPTION').parent().next().is("br"))
            $('#ODOR_OTHER_DESCRIPTION').parent().next().remove();
        $("#ODOR_OTHER_DESCRIPTION").parent().hide();
    }
}

/**
 * Setup and removal of the highlighting based on values
 */
function TurbidityOrNTUChange(){
    // if turbidity or ntu is given
    if($("#CLARITY_DESC").val() != "") {
        // remove the recommended/required denotation for both fields
        $("#CLARITY_DESC").next().next().html($("#CLARITY_DESC").next().next().html().replace(" *",""));
        $("#NTU").next().html($("#NTU").next().html().replace(" *",""));
        $("#NTU").removeClass('recommended');
    } else if ($("#NTU").val() != "") {
        // remove the recommended/required denotation for both fields
        $("#CLARITY_DESC").next().next().html($("#CLARITY_DESC").next().next().html().replace(" *",""));
        $("#CLARITY_DESC").removeClass('recommended');
        $("#NTU").next().html($("#NTU").next().html().replace(" *",""));
    } else {
        // add the recommended/required denotation for both fields
        if($("#CLARITY_DESC").next().next().html().indexOf(" *") < 0) {
            $("#CLARITY_DESC").next().next().html($("#CLARITY_DESC").next().next().html()+" *");
            $("#CLARITY_DESC").addClass('recommended');
        }
        if($("#NTU").next().html().indexOf(" *") < 0) {
            $("#NTU").next().html($("#NTU").next().html() + " *");
            $("#NTU").addClass('recommended');
        }
    }
}
