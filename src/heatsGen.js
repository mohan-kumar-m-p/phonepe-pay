function getAthlete(num) {
    return Array.from({ length: num }, (_, index) => index + 1);
}

function generateHeats() {
    const athletes = getAthlete(107);
    const minAthletes = 4;
    const maxAthletes = 8;
    const groups = [];

    const noOfGroup = Math.ceil(athletes.length / maxAthletes);
    const remainingAthletes = athletes.length % maxAthletes;

    const toLastSecondHeat = remainingAthletes > 0 ? Math.ceil((maxAthletes + remainingAthletes) / 2) : 0;
    const toLastHeat = remainingAthletes > 0 ? toLastSecondHeat - 1 : 0;

    for (let index = 0; index < noOfGroup; index++) {
        const startIndex = index * maxAthletes;
        const endIndex = startIndex + maxAthletes;

        let eachGroup;
        if (index + 2 === noOfGroup && toLastSecondHeat) {
            eachGroup = athletes.slice(startIndex, startIndex + toLastSecondHeat);
        } else if (index + 1 === noOfGroup && toLastHeat) {
            eachGroup = athletes.slice((startIndex - maxAthletes) + toLastSecondHeat);
        } else {
            eachGroup = athletes.slice(startIndex, endIndex);
        }
        const prepGroup = eachGroup?.map((d) => ({ position: d, heatsGroup: index + 1 }));
        groups?.push(prepGroup);
    }

    console.log('groups -=- ', groups);

}

function secondRoundHeats() {
    const athletes = getAthlete(24);
    const minAthletes = 4;
    const maxAthletes = 8;
    const groups = [];

    const noOfGroup = Math.ceil(athletes.length / maxAthletes);
    const remainingAthletes = athletes.length % maxAthletes;

    const toLastSecondHeat = remainingAthletes > 0 ? Math.ceil((maxAthletes + remainingAthletes) / 2) : 0;
    const toLastHeat = remainingAthletes > 0 ? toLastSecondHeat - 1 : 0;

    // sort db data on the basis of position.
    // just mimic.
    const sortAthletes = athletes.map(position => ({ position }))
        .sort((a, b) => a.position - b.position);

    const arrange = [];

    for (let index = 0; index < noOfGroup; index++) {
        for (let si = 0; si < maxAthletes; si++) {
            if (sortAthletes[index + si * noOfGroup]) {
                arrange?.push({ position: sortAthletes[index + si * noOfGroup]?.position, heatsGroup: index + 1 });
            }
        }
    }

    for (let index = 0; index < noOfGroup; index++) {
        const startIndex = index * maxAthletes;
        const endIndex = startIndex + maxAthletes;

        let eachGroup;
        if (index + 2 === noOfGroup && toLastSecondHeat) {
            eachGroup = arrange.slice(startIndex, startIndex + toLastSecondHeat);
        } else if (index + 1 === noOfGroup && toLastHeat) {
            eachGroup = arrange.slice((startIndex - maxAthletes) + toLastSecondHeat);
        } else {
            eachGroup = arrange.slice(startIndex, endIndex);
        }
        const prepGroup = eachGroup?.map((d) => ({ position: d?.position, heatsGroup: index + 1 }));
        groups?.push(prepGroup);
    }

    console.log('groups -=- ', groups);
    console.log('groups?.length -=- ', groups?.length);
}


generateHeats();
secondRoundHeats();