import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="container hero-container">

        {/* LEFT SIDE */}

        <div className="hero-left">

          <h2 className="hero-title">
            Explore.
            <br />
            Evaluate.
            <br />
            Enhance.
            <br />
            <span>Crack Placements.</span>
          </h2>

          <p className="hero-description">
            Solve coding challenges, prepare for placements,
            track your progress and become interview ready with
            one modern coding platform.
          </p>

          <div className="hero-buttons">

            <button className="btn-primary">
              Start Coding
            </button>

            <button className="btn-secondary">
              Explore Problems
            </button>

          </div>

          <div className="hero-stats">

            <div className="stat">
              <h3>10K+</h3>
              <span>Developers</span>
            </div>

            <div className="stat">
              <h3>1500+</h3>
              <span>Problems</span>
            </div>

            <div className="stat">
              <h3>500+</h3>
              <span>Companies</span>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="hero-right">

          <div className="editor-card">

            <div className="editor-header">

              <div className="window-buttons">

                <span className="red"></span>
                <span className="yellow"></span>
                <span className="green"></span>

              </div>

              <div className="editor-actions">

                <select>

                  <option>Java</option>
                  <option>Python</option>
                  <option>C++</option>

                </select>

                <button>Run</button>

              </div>

            </div>

            <div className="editor-body">

<pre>{`public class Solution {

    public static void main(String[] args){

        for(int i=1;i<=5;i++){

            System.out.println("*");

        }

    }

}`}</pre>

            </div>

            <div className="editor-footer">

              <div>

                <strong>Input</strong>

                <p>5</p>

              </div>

              <div>

                <strong>Status</strong>

                <p className="success">
                  ✓ Accepted
                </p>

              </div>

            </div>

          </div>

          <div className="floating-card solved">

            <small>Problems Solved</small>

            <h2>1248</h2>

            <span>+18 Today</span>

          </div>

          <div className="floating-card streak">

            <small>Current Streak</small>

            <h2>142 🔥</h2>

            <span>Days</span>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;