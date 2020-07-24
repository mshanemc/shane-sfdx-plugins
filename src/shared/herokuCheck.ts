const checkHerokuEnvironmentVariables = () => {
    if (!process.env.HEROKU_API_KEY) {
        throw new Error(
            'This requires a valid HEROKU_API_KEY in the environment.  heroku auth:token will get you temporary one, or use the heroku web gui to get a permanent one'
        );
    }
    if (!process.env.HEROKU_USERNAME || !process.env.HEROKU_PASSWORD) {
        throw new Error(
            'Heroku Connect API now requires signing into both heroku and a salesforce org, so both HEROKU_USERNAME and HEROKU_PASSWORD variables must be set'
        );
    }
};

export { checkHerokuEnvironmentVariables };
