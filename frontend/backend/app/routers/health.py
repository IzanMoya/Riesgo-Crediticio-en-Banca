from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/health")
def health(req: Request):
    bundle = req.app.state.bundle
    return {
        "status": "ok",
        "metadata": bundle.metadata,
        "n_features_post_selection": len(bundle.selected_features),
        "selected_features": bundle.selected_features,
    }
