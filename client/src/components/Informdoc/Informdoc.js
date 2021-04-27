import React, {useRef, useState} from "react";
import { Component } from "react";
import { consentItems, reseachinfomation} from "./consentForm.js";
import './Informdoc.css'
import {Button} from "react-bootstrap";
import Pdf from "react-to-pdf";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ref = React.createRef();
let accountNo = 0;

const Informdoc = ({inform, emailid}) => {

    console.log("inform", inform)
    console.log("email", emailid)
    const[buttonDisabled, setbuttonDisabled] = useState({itemName:'', disabled:false})

    function onRadiobuttonChange(event) {

        if(event.target.value === 'No'){
            accountNo += 1;
            setbuttonDisabled({itemName: event.target.name, disabled: true});

        }else if(event.target.value === 'Yes') {
            if (accountNo > 0){
                accountNo -= 1;
            }
            setbuttonDisabled({itemName: event.target.name, disabled: false});
        }
        console.log("accountNo",accountNo);
    }

    function  exportInforPDF(){
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 220;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Experiment Information";
        const headers = [["Questions", "Answers"]];

        const data = reseachinfomation.items.map( (item, index) =>[reseachinfomation.items[index].question
            , reseachinfomation.items[index].answer]);

        let content = {
            startY: 50,
            head: headers,
            body: data,
            styles: { halign: 'left',fontSize: 10, cellPadding: 5,lineColor: 2,lineWidth:0.2},
            columnStyles: {Questions:{width: 200 }}
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("ExperimentInfor.pdf")
    }

    if(inform == 'inform') {
            return(
            <div>
                    {reseachinfomation.items.map(
                        (item, index)=>(
                            <div key={index}>
                                    <h6 style={{color: "blue"}}>{reseachinfomation.items[index].question}</h6>
                                    <p>{reseachinfomation.items[index].answer}</p>
                            </div>
                        )
                    )}
                    <h6>Do you want to {<button onClick= {exportInforPDF} style={{backgroundColor:'lightblue', marginInline:5,borderradius:10}}>Download</button>}
                ?</h6>
            </div>
            )
    }else if(inform == 'consent') {
            return (
                <div>
                <div ref={ref}>
                    <span>User Email: {emailid}</span>
                    <hr/>
                    {consentItems.items.map(
                    (item, index) => (
                        <div key={index}>
                                {consentItems.items[index]}
                                <div onClick={onRadiobuttonChange}>
                                        <input type="radio" value="Yes" name={item}/>
                                        <label>Yes</label>
                                        <span>   </span>
                                        <input type="radio" value="No" name={item}/>
                                        <label>No</label>
                                </div>
                            <span id={item} style={{
                                display: (buttonDisabled.itemName == item && buttonDisabled.disabled) ? "block" : "none",
                                color: "red"
                            }}>This item you chose "No", you cannot participate this experiment.</span>
                            <div className="border"> </div>
                        </div>
                    )
                )}

                </div>
                    <Pdf targetRef={ref} filename="userconsent.pdf">
                        {({ toPdf }) => <Button disabled={accountNo!==0} className="submit" onClick={toPdf}>Submit</Button>}
                    </Pdf>
                </div>
            )
    }
}

export default Informdoc;
