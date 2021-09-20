import Navbar from "../components/Navbar";
import * as canvas from 'canvas';

import * as faceapi from 'face-api.js';
import React from 'react';


class MeetNow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isClosed: false,
            didStart: false,
            exit: false,
            meetLength: 20, // 900 seconds => 15mins,
            countDown: 20,
            currentQuestion: 0,
            questions: [
                {
                    question: 'Tell us about you',
                    duration: 5 //120
                },
                {
                    question: 'What are your biggest strenghts?',
                    duration: 6//120
                },
               /**
                *  {
                  question: 'Where do you see yourself in 5 years , and your objectives',
                  duration: 10//180
                },
                {
                  question: 'Out of the candidates, why should we hire you ?',
                  duration: 10//60
                },
                {
                  question: 'Why do you want this job?',
                  duration: 15//120
                },
                {
                  question: 'Tell us about time you disagreed with a decision. What did you do?',
                  duration: 12//180
                },
                {
                  question: 'Tell us how you think other people would describe you?',
                  duration: 10//120
                },

                */
            ],

            endOfInterview: false,
            savedFaceStates: [],

            result: [
                { expression: "neutral", result: 0 },
                { expression: "surprised", result: 0 },
                { expression: "happy", result: 0 },
                { expression: "angry", result: 0 },
                { expression: "disgusted", result: 0 },
                { expression: "sad", result: 0 },
                { expression: "fearful", result: 0 }
            ]
            ,


            didPass: false,
            candidate: null,
            id: props.match.params.id

        }

        this.startTheInterveiw = this.startTheInterveiw.bind(this);
    }


    startTheInterveiw() {
        this.setState({
            didStart: true
        })

        const countDown = setInterval(() => {
            this.getCurrentExpression();

            this.setState({
                countDown: (this.state.countDown - 1)
            })


            if (this.state.countDown === 0) {
                // end of of interview
                this.setState({ endOfInterview: true })

                clearInterval(countDown);

                this.calculateResult()

            } else {

            }

        }, 1000);
    }



    calculateResult() {

        let resultmage = this.state.result;

        for (let i = 0; i < resultmage.length; i++) {
            const expression = resultmage[i];


            for (let j = 0; j < this.state.savedFaceStates.length; j++) {
                const savedExpression = this.state.savedFaceStates[j];

                if (expression.expression === savedExpression[0].expression) {
                    expression.result = expression.result + 1;
                }

            }

        }

        this.setState({
            result: resultmage
        })


        setTimeout(() => {
            this.sendResultServer();
        }, 1000);


    }


    getCurrentExpression() {
        var video = document.getElementById('video');

        navigator.mediaDevices.getUserMedia({ video: true }).then(async (stream) => {
            //video.src = window.URL.createObjectURL(stream);



            faceapi.loadSsdMobilenetv1Model('../weights/ssd_mobilenetv1_model-weights_manifest.json').then((res) => {
                faceapi.loadFaceExpressionModel('../weights/face_expression_model-weights_manifest.json').then((res) => {
                    faceapi.detectSingleFace(video).withFaceExpressions().then((r) => {

                        if (r != null) {
                            let tmp = this.state.savedFaceStates;
                            tmp.push(r.expressions.asSortedArray());
                            this.setState({ savedFaceStates: tmp })

                            console.log(this.state.savedFaceStates);
                        }
                    })

                }).catch((e) => {
                    console.log(e);
                })


            }).catch((e) => {
                console.log(e);
            })



        });



        //const res = await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');


    }

    nextQuestion() {
        if ((this.state.currentQuestion + 1) != this.state.questions.length) {
            this.setState({
                currentQuestion: (this.state.currentQuestion + 1),
                countDown: 0
            })
        }
    }

    componentDidMount() {

        // Grab elements, create settings, etc.
        var video = document.getElementById('video');

        // Get access to the camera!
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Not adding `{ audio: true }` since we only want video now
            navigator.mediaDevices.getUserMedia({ video: true }).then(async (stream) => {
                //video.src = window.URL.createObjectURL(stream);
                video.srcObject = stream;
                video.play();



            });
        }


        this.getCondidateDetails();


    }
 

    sendResultServer(){
        

        const intervention = { 
            result:this.state.result,
            id:this.state.id
          }
    
          let url = 'http://localhost:8080/api/condidate/closeMeet';
    
          var myHeaders = new Headers();
    
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Authorization", localStorage.getItem('token'));
      
          var raw = JSON.stringify(intervention);
    
          var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
          };
    
          fetch(url, requestOptions)
          .then(response => response.json())
          .then(result =>{
              console.log(result)
    
              if (result.success === true) {
                this.setState({
                    isInserted: true,
                    messageRes:result.message
                })
            }
               
          })
          .catch(error => console.log('error', error));
    }


    getCondidateDetails() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", localStorage.getItem('token'));


        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("http://localhost:8080/api/condidate/details?id=" + this.state.id, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);

                this.setState({
                    candidate: result.data
                })
            })
            .catch(error => console.log('error', error));
    }


    finish(){
        this.setState({
            endOfInterview: true,

        })


        let resultmage = this.state.result;

        for (let i = 0; i < resultmage.length; i++) {
            const expression = resultmage[i];


            for (let j = 0; j < this.state.savedFaceStates.length; j++) {
                const savedExpression = this.state.savedFaceStates[j];

                if (expression.expression === savedExpression[0].expression) {
                    expression.result = expression.result + 1;
                }

            }

        }

        this.setState({
            result: resultmage
        })


        setTimeout(() => {
            this.sendResultServer();
        }, 1000);



    }

    closeApp(){
        this.setState({isClosed:true})
    }

    render() {
        return (
            <div  >

                <Navbar />



                {
                    this.state.isClosed === false ?
                    <div className="container mt-5">
                    <div className="row">
                        <div className="col-sm-8">

                            <video className={(this.state.didStart === false || this.state.endOfInterview === true) ? 'hidden-video' : ''} id="video" width={'100%'} height={500} />

                        </div>

                        <div className="col-sm-4">

                            {
                                this.state.candidate !== null ?
                                    <div>
                                        {
                                            this.state.candidate.didPassMeet === false  ?
                                                <div>
                                                    {
                                                        this.state.didStart === false ?
                                                            <section>
                                                                <h3>Welcome !</h3>

                                                                <p>
                                                                    1.You will have only 15 minutes to answer to the interview

                                                                </p>

                                                                <p>
                                                                    2.You cannot exit from the interview while you&#39;re playing
                                                                </p>


                                                                <button className="btn btn-danger  " style={{ marginRight: 25, width: 100 }} onClick={() => { this.closeApp() }} >Exit</button>
                                                                <button className="btn btn-success  " style={{ marginRight: 25, width: 100 }} onClick={() => { this.startTheInterveiw() }} >Continue</button>
                                                            </section>
                                                            :
                                                            <section>
                                                                {
                                                                    this.state.endOfInterview === false ?
                                                                        <section>
                                                                            <h3>interview Clock :</h3>


                                                                            <div className="clock">
                                                                                <p>

                                                                                    {
                                                                                        this.state.countDown > 60 ? (this.state.countDown / 60).toFixed() + ' min(s)'  : this.state.countDown + ' sec(s)'
                                                                                    } / 15 mins
                                                                                </p>
                                                                            </div>


                                                                            <hr />

                                                                            <p>
                                                                                <strong>
                                                                                    Current question :
                                                                                </strong>
                                                                            </p>

                                                                            <p>
                                                                                {this.state.questions[this.state.currentQuestion].question}
                                                                            </p>

                                                                            {
                                                                                this.state.currentQuestion !== (this.state.questions.length -1 ) ?
                                                                                <button onClick={() => { this.nextQuestion() }} className="btn btn-primary" >Next question</button>
                                                                            
                                                                                :
                                                                                <button onClick={() => { this.finish() }} className="btn btn-primary" >Finish</button>
                                                                            
                                                                            }        
                                                                            

                                                                        </section> :
                                                                        <section>

                                                                            <h3>Thanks for your time</h3>
                                                                            <p>
                                                                                We will contact in no time, stay tuned.
                                                                            </p>





                                                                        </section>
                                                                }

                                                            </section>
                                                    }
                                                </div> :
                                                <div>
                                                    <h3>Oups !</h3>
                                                    <p>Looks like you are using an old url, please contact you job recruter for more details</p>
                                                </div>
                                        }

                                    </div>
                                    :
                                    <div>
                                        <h3>Please wait ...</h3>

                                    </div>
                            }


                        </div>



                    </div>
                </div>
                :
                <div className="container mt-5 text-center">
                    <h1>Okay goodbye !</h1>
                </div>
                }

            </div>
        );
    }
}

export default MeetNow;
