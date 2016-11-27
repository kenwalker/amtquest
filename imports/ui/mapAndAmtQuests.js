import { Template } from 'meteor/templating';
import { Amtquests } from '../api/amtquests.js';

import './mapAndAmtQuests.html';


Template.main.helpers({
  amtquests() {
    return Amtquests.find({}, {sort: {date: 'dec'}});
  }
});