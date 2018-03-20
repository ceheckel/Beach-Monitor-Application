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
        if($(desc).next().html().indexOf(" *") < 0)
            $(desc).next().html($(desc).next().html()+" *");
        $(desc).addClass('required');
    } else {
        // remove possible 'required' tages if the field becomes unselected
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


        // make the description field 'required'
        if($('#RAINFALL_STN_DESC').next().next().html().indexOf(" *") < 0)
            $('#RAINFALL_STN_DESC').next().next().html($('#RAINFALL_STN_DESC').next().next().html()+" *");
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
 * Setup and removal of the description field for
 * odor based on its html attributes
 */
function OdorChange() {
    if($("#ODOR_DESCRIPTION").val() == 'Other'){
        // setup the html for the description field
        if(!$('#ODOR_OTHER_DESCRIPTION').parent().next().is("br"))
            $('#ODOR_OTHER_DESCRIPTION').parent().after("<br>");
        $("#ODOR_OTHER_DESCRIPTION").parent().show();

        // make the description field 'required'
        if($("#ODOR_OTHER_DESCRIPTION").next().html().indexOf(" *") < 0)
            $("#ODOR_OTHER_DESCRIPTION").next().html($("#ODOR_OTHER_DESCRIPTION").next().html()+" *");
        $("#ODOR_OTHER_DESCRIPTION").addClass('required');
    } else {
        // remove possible 'required' tags if the field becomes unselected
        $("#ODOR_OTHER_DESCRIPTION").next().html($("#ODOR_OTHER_DESCRIPTION").next().html().replace(" *",""));
        $("#ODOR_OTHER_DESCRIPTION").removeClass('required');
        $("#ODOR_OTHER_DESCRIPTION").parent().removeClass('is-dirty');
        $("#ODOR_OTHER_DESCRIPTION").val("");

        // remove setup for description field
        if($('#ODOR_OTHER_DESCRIPTION').parent().next().is("br"))
            $('#ODOR_OTHER_DESCRIPTION').parent().next().remove();
        $("#ODOR_OTHER_DESCRIPTION").parent().hide();
    }
}

function TurbidityOrNTUChange(){
    if($("#CLARITY_DESC option:selected").index() > 0){
        if($('#CLARITY_DESC').next().next().html().indexOf(" *") < 0)
            $('#CLARITY_DESC').next().next().html($('#CLARITY_DESC').next().next().html() + " *");
        $('#CLARITY_DESC').addClass('required');
        if(($('#NTU').val() == "")){
            $('#NTU').next().html($('#NTU').next().html().replace(" *", ""));
            $('#NTU').removeClass('required');
        }
    }
    else if($('#NTU').val() == ""){
        if($('#NTU').next().html().indexOf(" *") < 0)
            $('#NTU').next().html($('#NTU').next().html() + " *");
        $('#NTU').addClass('required');
        if($('#CLARITY_DESC').next().next().html().indexOf(" *") < 0)
            $('#CLARITY_DESC').next().next().html($('#CLARITY_DESC').next().next().html() + " *");
        $('#CLARITY_DESC').addClass('required');
    }

    if($('#NTU').val() != "") {
        if($('#NTU').next().html().indexOf(" *") < 0)
            $('#NTU').next().html($('#NTU').next().html() + " *");
        $('#NTU').addClass('required');
        if($("#CLARITY_DESC option:selected").index() <= 0){
            $('#CLARITY_DESC').next().next().html($('#CLARITY_DESC').next().next().html().replace(" *",""));
            $('#CLARITY_DESC').removeClass('required');
        }
    }
}