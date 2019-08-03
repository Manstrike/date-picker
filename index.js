$(document).ready(readyHandler);

const format = 'DD-MM-YYYY';

const Unit = {
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
    QUARTER: 'quarter',
    YEAR: 'year',
    TODAY: 'today',
}

const Mode = {
    PRESENT: 'pres',
    PREVIOUS: 'prev',
    TO_DATE: 'to-date',
}

const momentUnitMapping = {
    [Unit.DAY] : 'day',
    [Unit.WEEK] : 'isoWeek',
    [Unit.MONTH] : 'month',
    [Unit.QUARTER] : 'quarter',
    [Unit.YEAR] : 'year',
    [Unit.TODAY] : 'day'
}

function readyHandler() {
    /**
     * calendar init
     */
    pickmeup('.template', {  
        flat: true,
        mode: 'range',
        calendars: 3,
    });

    /**
     * preset-panel handler
     */
    $('a').click(presetHandler);

    $('.ui-widget-content').change(customHandler);

}

function customHandler() {
    const mode = $(this).attr('id');
    const timeUnits = String($(this).val()).toLowerCase();
    const findInput = 'txt' + mode; 
    const range = $(`#${findInput}`).val();

    const dateRange = calcDateRange(mode, timeUnits, range);

    pickmeup('.template').set_date(dateRange);
}

function presetHandler() {
    $('a').removeClass();
    $(this).addClass('selected');

    const timeUnits = $(this).data('value');

    const dateRange = calcPresetDates(timeUnits);

    pickmeup('.template').set_date(dateRange);    
}

function setStartDate(mode, range) {
    if (mode === Mode.PRESENT) {
        return range-1;
    }

    return range;
}

function setEndDate(mode, units) {
    let endDate;
    switch (mode) {
        case Mode.PRESENT :
            endDate = moment().endOf(units).format(format);
            break;
        case Mode.PREVIOUS :
            endDate = moment().subtract(1, units).endOf(units).format(format);
            break;
        case Mode.TO_DATE :
            endDate = moment().format(format);
            break;
    }

    return endDate;
}

function calcDateRange(mode, timeUnits, range) {
    const tempRange = [];

    const startDate = setStartDate(mode, range)

    const units = momentUnitMapping[timeUnits];    

    
    const start = moment().startOf(units).subtract(startDate, units).format(format);
    const end = setEndDate(mode, units);

    tempRange.push(start);
    tempRange.push(end);

    return tempRange;
}

function calcPresetDates(timeUnits) {
    const today = moment().format(format);

    if (timeUnits === Unit.TODAY) {
        return [today, today];
    }

    if (timeUnits === Unit.DAY) {
        const yesterday = moment().subtract(1,'days').format(format);
        return [yesterday, yesterday];
    }

    const units = momentUnitMapping[timeUnits];

    const start = moment().startOf(units).format(format);

    return [start, today];
}


