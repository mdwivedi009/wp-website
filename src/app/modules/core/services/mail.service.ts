import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class MailService {
  sendMail(promptSet: any, link: String,) {
    var subject = 'Writing prompt';
    var body = ` <div><h5>Hello ${promptSet[0].name}</h5>
       <p>We are pleased to inform you that we have reviewed the prompts submitted by you:</p>
       <p> ${promptSet.map((prompt: any) => (
      `Your prompt ${prompt.prompt} is ${prompt.status}. 
      ${prompt.status == 'rejected' ? 'We are sorry about it, you can submit it once more through the app for review.' : ''} <br>`
    )).join('')}
      The approved prompts will be visible in the app now. Check it out in the app ${link} here.
     </p>
     <h6>Regards,</h6>
     <h6>The Writing Prompts Team</h6>
       </div> `;
    var payload = {
      "personalizations": [{ "to": [{ "email": promptSet[0].email }] }],
      "from": { "email": "bewtechnologies@gmail.com" },
      "subject": subject,
      "content": [{ "type": "text/html", "value": body }]
    }
    var myHeaders = new Headers({
      "Content-Type": "application/json",
      "Authorization": "Bearer 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",
    });
    fetch("https://api.sendgrid.com/v3/mail/send",
      {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(payload)
      })
      .then(function (res) { console.log('success'); return true; })
      .then(function (data) {
        console.log(JSON.stringify(data))
        alert('Mail send successfully');
      })
  }

  sendMailStory( storySet: any, link: String) {
    console.log(storySet)
    var subject = 'Writing prompt';
    var body = ` <div><h5>Hello ${storySet[0].name}</h5>
       <p>We are pleased to inform you that we have reviewed the stories submitted by you:</p>
       <p> ${storySet.map((story: any) => (
        `Your story ${story.story} is ${story.status}. 
        ${story.status == 'rejected' ? 'We are sorry about it, you can submit it once more through the app for review.' : ''} <br>`
      )).join('')}

      The approved stories will be visible in the app now. Check it out in the app ${link} here.
     </p>
     <h6>Regards,</h6>
     <h6>The Writing Prompts Team</h6>
       </div> `;
      //  console.log(body);
    var payload = {
      "personalizations": [{ "to": [{ "email": storySet[0].email }] }],
      "from": { "email": "bewtechnologies@gmail.com" },
      "subject": subject,
      "content": [{ "type": "text/html", "value": body }]
    }
    var myHeaders = new Headers({
      "Content-Type": "application/json",
      "Authorization": "Bearer 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",
      // "Authorization": "Bearer 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",
    });
    fetch("https://api.sendgrid.com/v3/mail/send",
      {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(payload)
      })
      .then(function (res) { console.log('success'); return true; })
      .then(function (data) { console.log(JSON.stringify(data)) })
  }

}


