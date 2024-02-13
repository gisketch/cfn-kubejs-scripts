ItemEvents.tooltip(event => {
  event.addAdvanced('kubejs:chowcoin', (item, advanced, text) => {
    text.add(1, [Text.white('This '), Text.gold('coin').bold(true), Text.white(' serves as the currency for the Chowkingdom server.')]);
  }); // Added missing closing parenthesis here
}); // Added missing closing parenthesis for the ItemEvents.tooltip call
