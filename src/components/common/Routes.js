import { useContext } from "react";
import { useHistory } from "react-router-dom";
import Bounce from "react-reveal/Bounce";
import UserContext from "../user/UserContext";
import Requester from "../global/Requester";
import pin from "../../assets/paper-push-pin.svg";

export default function Routes({ routes, spy }) {
    const { loggedIn, pinnedRoutes, setPinnedRoutes } = useContext(UserContext);
    const history = useHistory();

    const pinRoute = async route => {
        try {
            const response = await Requester.postRoutePin(route);
            setPinnedRoutes(response.data.routes);
        } catch (error) {
            console.error(error);
        }
    };

    const unpinRoute = async route => {
        try {
            const response = await Requester.deleteRoutePin(route);
            setPinnedRoutes(response.data.routes);
        } catch (error) {
            console.error(error);
        }
    };

    // We can't use includes because the pinned route and the displayed route
    // Are considered different objects
    // If the find returns undefined, this route is not pinned
    const isPinned = route => {
        return pinnedRoutes.find(r => r.id === route.id) !== undefined;
    };

    return (
        <div
            className='route-buttons-container buttons-container'
            style={{ overflow: "hidden" }}>
            {routes.map(route => (
                <Bounce bottom key={route.id} spy={spy}>
                    <div className='route-buttons'>
                        <button
                            type='button'
                            className='route-button control-button'
                            style={{ backgroundColor: `#${route.color}` }}
                            onClick={() => history.push(`/routes/${route.id}`)}>
                            <p className='route-number'>{route.shortName}</p>
                            <p className='route-longname'>{route.longName}</p>
                        </button>
                        <button
                            disabled={!loggedIn}
                            className='route-pin-button pin-button'
                            style={{ backgroundColor: `#${route.color}` }}
                            onClick={() =>
                                isPinned(route)
                                    ? unpinRoute(route.id)
                                    : pinRoute(route)
                            }>
                            <img
                                src={pin}
                                alt='pin'
                                className='pin-img'
                                style={{
                                    filter: isPinned(route)
                                        ? "invert(100%)"
                                        : "invert(0%)"
                                }}
                            />
                        </button>
                    </div>
                </Bounce>
            ))}
        </div>
    );
}
