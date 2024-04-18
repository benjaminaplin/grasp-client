"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./App.css");
var Layout_1 = require("./components/layout/Layout");
var applications_1 = require("./pages/applications");
var contacts_1 = require("./pages/contacts");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var companies_1 = require("./pages/companies");
var ResourceView_1 = require("./components/resource-view/ResourceView");
var next_steps_1 = require("./pages/next-steps");
var dashboard_1 = require("./pages/dashboard");
var interviews_1 = require("./pages/interviews");
var styles_1 = require("@mui/material/styles");
var CssBaseline_1 = require("@mui/material/CssBaseline");
var colors_1 = require("@mui/material/colors");
var react_1 = require("react");
var ColorMode_1 = require("./context/ColorMode");
var touches_1 = require("./pages/touches");
var AdapterDayjs_1 = require("@mui/x-date-pickers/AdapterDayjs");
var LocalizationProvider_1 = require("@mui/x-date-pickers/LocalizationProvider/LocalizationProvider");
var queryClient = new react_query_1.QueryClient();
var palette = {
    light: {
        primary: {
            main: '#34C0AC',
            light: '#B1DED3',
            dark: '#00765A',
        },
    },
};
var getDesignTokens = function (mode) { return ({
    palette: __assign({ mode: mode }, (mode === 'light'
        ? {
            // palette values for light mode
            primary: colors_1.amber,
            divider: colors_1.amber[200],
            text: {
                primary: colors_1.grey[900],
                secondary: colors_1.grey[800],
            },
        }
        : {
            // palette values for dark mode
            primary: {
                main: palette.light.primary.main,
                light: palette.light.primary.light,
                dark: palette.light.primary.dark,
            },
            divider: 'rgba(255, 255, 255, 0.12)',
            background: {
                default: '#121212',
                paper: '#121212',
            },
            text: {
                primary: '#fff',
                secondary: 'rgba(255, 255, 255, 0.7)',
                disabled: 'rgba(255, 255, 255, 0.5)'
            },
            action: {
                active: '#fff',
                hover: 'rgba(255, 255, 255, 0.08)',
                selected: 'rgba(255, 255, 255, 0.16)',
                disabled: 'rgba(255, 255, 255, 0.3)',
                disabledBackground: 'rgba(255, 255, 255, 0.12)'
            }
        })),
}); };
function App() {
    var _a = (0, react_1.useState)('light'), mode = _a[0], setMode = _a[1];
    var colorMode = (0, react_1.useMemo)(function () { return ({
        // The dark mode switch would invoke this method
        toggleColorMode: function () {
            setMode(function (prevMode) {
                return prevMode === 'light' ? 'dark' : 'light';
            });
        },
    }); }, []);
    // Update the theme only if the mode changes
    var theme = (0, react_1.useMemo)(function () { return (0, styles_1.createTheme)(getDesignTokens(mode)); }, [mode]);
    return (<react_query_1.QueryClientProvider client={queryClient}>
      <LocalizationProvider_1.LocalizationProvider dateAdapter={AdapterDayjs_1.AdapterDayjs}>
        <ColorMode_1.ColorModeContext.Provider value={colorMode}>
        <styles_1.ThemeProvider theme={theme}>
          <CssBaseline_1.default />
          <react_router_dom_1.BrowserRouter>
            <react_router_dom_1.Routes>
              <react_router_dom_1.Route path="/" element={<dashboard_1.Dashboard />}/>
              <react_router_dom_1.Route path="/dashboard" element={<dashboard_1.Dashboard />}/>
              <react_router_dom_1.Route path="/contacts" element={<contacts_1.Contacts />}/>
              <react_router_dom_1.Route path="/contacts/:id" element={<ResourceView_1.ResourceView relation='nextSteps'/>}/>
              <react_router_dom_1.Route path="/next-steps" element={<next_steps_1.NextSteps />}/>
              <react_router_dom_1.Route path="/next-steps/:id" element={<ResourceView_1.ResourceView />}/>
              <react_router_dom_1.Route path="/job-applications" element={<applications_1.Applications />}/>
              <react_router_dom_1.Route path="/interviews" element={<interviews_1.Interviews />}/>
              <react_router_dom_1.Route path="/job-applications/:id" element={<ResourceView_1.ResourceView />}/>
              <react_router_dom_1.Route path="/companies" element={<companies_1.Companies />}/>
              <react_router_dom_1.Route path="/companies/:id" element={<ResourceView_1.ResourceView />}/>
              <react_router_dom_1.Route path="/touches" element={<touches_1.Touches />}/>
              <react_router_dom_1.Route path="/touches/:id" element={<ResourceView_1.ResourceView />}/>
              <react_router_dom_1.Route path="*" element={<NoMatch />}/>
            </react_router_dom_1.Routes>
          </react_router_dom_1.BrowserRouter>
        </styles_1.ThemeProvider>
        </ColorMode_1.ColorModeContext.Provider>
      </LocalizationProvider_1.LocalizationProvider>
    </react_query_1.QueryClientProvider>);
}
exports.default = App;
var NoMatch = function () { return <Layout_1.default title=""><div>Nothing to see here</div></Layout_1.default>; };
