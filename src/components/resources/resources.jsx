import React from "react";
import "./resources.css";
const Resources = () => {
  return (
    <div className="resources-container">
      <h1>Wellness Resources</h1>
      <div className="grid">
        <div className="grid-item">
          <h2>Physical Wellness</h2>
          <ul>
            <li>
              <a
                href="https://www.hubermanlab.com/newsletter/foundational-fitness-protocol"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Swole with Huberman Labs
              </a>
            </li>
            <li>
              <a
                href="https://www.bodybuilding.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Bodybuilding Fitness Plans
              </a>
            </li>
            <li>
              <a
                href="https://www.crossfit.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Crossfit Swole-ness
              </a>
            </li>
          </ul>
        </div>

        <div className="grid-item">
          <h2>Mental Wellness</h2>
          <ul>
            <li>
              <a
                href="https://www.jamesclear.com/atomic-habits"
                target="_blank"
                rel="noopener noreferrer"
              >
                Swole Habit Building with James Clear
              </a>
            </li>
            <li>
              <a
                href="https://www.headspace.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Swole Headspace
              </a>
            </li>
            <li>
              <a
                href="https://www.calm.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Swole relaxation
              </a>
            </li>
          </ul>
        </div>

        <div className="grid-item">
          <h2>Spiritual Wellness</h2>
          <ul>
            <li>
              <a
                href="https://www.eckharttolle.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Spiritual Teacniques
              </a>
            </li>
            <li>
              <a
                href="https://www.onbeing.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Spiritual Reflections
              </a>
            </li>
            <li>
              <a
                href="https://www.dailyom.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Spiritual Courses
              </a>
            </li>
          </ul>
        </div>

        <div className="grid-item">
          <h2>Swole Foods</h2>
          <ul>
            <li>
              <a
                href="https://www.wellplated.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Well Plated
              </a>
            </li>
            <li>
              <a
                href="https://www.skinnytaste.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Skinnytaste
              </a>
            </li>
            <li>
              <a
                href="https://www.thespruceeats.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                The Spruce Eats
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Resources;
