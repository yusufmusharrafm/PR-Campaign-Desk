import os
import sys
from datetime import date, datetime, timedelta, timezone

# Add app package directory to path if running directly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models import Campaign, ActivityLog


def seed_data(db_session=None):
    close_session_on_exit = False
    if db_session is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_session_on_exit = True
    else:
        db = db_session

    try:
        # Check if campaigns already exist
        existing_count = db.query(Campaign).count()
        if existing_count > 0:
            print(f"Database already seeded with {existing_count} campaigns. Skipping.")
            return

        today = date.today()

        campaigns_data = [
            {
                "title": "Series A Funding Announcement",
                "client_name": "NeuroTech AI",
                "status": "NEW",
                "priority": "HIGH",
                "deadline": today + timedelta(days=22),
                "assigned_person": "Sarah Jenkins",
                "target_publication": "TechCrunch",
                "story_summary": "NeuroTech AI raises $15M in Series A funding led by Sequoia to scale their brain-computer interface SDK.",
                "notes": "Client wants top-tier tech launch. Embargo date set for Sept 25.",
                "next_action": "Schedule messaging kickoff call with CEO",
                "history": [
                    ("CREATED", "Campaign 'Series A Funding Announcement' created.", "Sarah Jenkins")
                ]
            },
            {
                "title": "Q3 Enterprise Security Benchmark Report",
                "client_name": "Sentinel Cyber",
                "status": "STORY_DEVELOPMENT",
                "priority": "HIGH",
                "deadline": today + timedelta(days=28),
                "assigned_person": "Marcus Chen",
                "target_publication": "Forbes Tech",
                "story_summary": "Annual benchmark revealing 40% increase in AI-driven credential harvesting attacks in Fortune 500 companies.",
                "notes": "Data is verified by internal threat intel team. Needs strong infographic visual.",
                "next_action": "Outline key statistics and draft press release executive quotes",
                "history": [
                    ("CREATED", "Campaign 'Q3 Enterprise Security Benchmark Report' created.", "Marcus Chen"),
                    ("STATUS_CHANGE", "Status moved from NEW to STORY_DEVELOPMENT.", "Marcus Chen")
                ]
            },
            {
                "title": "Sustainable Supply Chain Innovation Feature",
                "client_name": "GreenFreight Logistics",
                "status": "ARTICLE_DRAFT",
                "priority": "MEDIUM",
                "deadline": today + timedelta(days=15),
                "assigned_person": "Elena Rostova",
                "target_publication": "Supply Chain Brain",
                "story_summary": "How electric fleet integration cut carbon emissions by 30% across North American transport routes.",
                "notes": "Focus on ROI and emissions metrics. Target trade publications first.",
                "next_action": "Finalize article draft for internal review",
                "history": [
                    ("CREATED", "Campaign created.", "Elena Rostova"),
                    ("STATUS_CHANGE", "Status moved from NEW to STORY_DEVELOPMENT.", "Elena Rostova"),
                    ("STATUS_CHANGE", "Status moved from STORY_DEVELOPMENT to ARTICLE_DRAFT.", "Elena Rostova")
                ]
            },
            {
                "title": "Executive Byline: The Future of Quantum Encryption",
                "client_name": "CipherShield",
                "status": "CLIENT_REVIEW",
                "priority": "MEDIUM",
                "deadline": today + timedelta(days=12),
                "assigned_person": "Sarah Jenkins",
                "target_publication": "Dark Reading",
                "story_summary": "Thought leadership article by CTO Dr. Aris Thorne on post-quantum cryptography standards.",
                "notes": "Sent draft to client marketing VP on Monday. Awaiting final legal signoff.",
                "next_action": "Follow up with VP Marketing for client edits",
                "history": [
                    ("CREATED", "Campaign created.", "Sarah Jenkins"),
                    ("STATUS_CHANGE", "Status moved to CLIENT_REVIEW.", "Sarah Jenkins")
                ]
            },
            {
                "title": "Autonomous Robotics Warehouse Expansion",
                "client_name": "RoboFlow Systems",
                "status": "APPROVED",
                "priority": "HIGH",
                "deadline": today + timedelta(days=9),
                "assigned_person": "Alex Vance",
                "target_publication": "Robotics Business Review",
                "story_summary": "RoboFlow deploys 500 next-gen sorting robots in major Midwest fulfillment center.",
                "notes": "Client approved draft without changes. Photos and video package ready.",
                "next_action": "Build targeted journalist media list for pitch outreach",
                "history": [
                    ("CREATED", "Campaign created.", "Alex Vance"),
                    ("STATUS_CHANGE", "Status moved to APPROVED.", "Alex Vance")
                ]
            },
            {
                "title": "Healthcare AI Diagnostic Tool Pitch",
                "client_name": "MedVanguard",
                "status": "MEDIA_OUTREACH",
                "priority": "HIGH",
                "deadline": today + timedelta(days=5),
                "assigned_person": "Marcus Chen",
                "target_publication": "MobiHealthNews",
                "story_summary": "FDA clearance granted for MedVanguard's real-time stroke detection algorithm.",
                "notes": "Pitching health tech editors under 24-hour embargo.",
                "next_action": "Send personalized pitches to lead health technology writers",
                "history": [
                    ("CREATED", "Campaign created.", "Marcus Chen"),
                    ("STATUS_CHANGE", "Status moved to MEDIA_OUTREACH.", "Marcus Chen")
                ]
            },
            {
                "title": "Cloud Cost Optimization Launch",
                "client_name": "FinOps Scale",
                "status": "PUBLISHED",
                "priority": "MEDIUM",
                "deadline": today - timedelta(days=4),
                "assigned_person": "Elena Rostova",
                "target_publication": "VentureBeat",
                "story_summary": "FinOps Scale unveils platform that automatically reduces AWS/GCP cloud spend by 25%.",
                "notes": "Article published on VentureBeat on Aug 30. High social engagement.",
                "next_action": "Share coverage report with client executive team",
                "history": [
                    ("CREATED", "Campaign created.", "Elena Rostova"),
                    ("STATUS_CHANGE", "Status moved to PUBLISHED.", "Elena Rostova")
                ]
            },
            {
                "title": "Annual Sustainability Impact Profile",
                "client_name": "CleanWater Co",
                "status": "COMPLETED",
                "priority": "LOW",
                "deadline": today - timedelta(days=19),
                "assigned_person": "Alex Vance",
                "target_publication": "Environmental Leader",
                "story_summary": "CleanWater Co milestone of filtering 1 billion gallons of municipal water.",
                "notes": "Full campaign finished. Secured 4 placements across trade and regional media.",
                "next_action": "Archive campaign assets and close project folder",
                "history": [
                    ("CREATED", "Campaign created.", "Alex Vance"),
                    ("STATUS_CHANGE", "Status moved to COMPLETED.", "Alex Vance")
                ]
            }
        ]

        now = datetime.now(timezone.utc)
        for data in campaigns_data:
            history = data.pop("history")
            campaign = Campaign(**data, created_at=now, updated_at=now)
            db.add(campaign)
            db.commit()
            db.refresh(campaign)

            for action_type, description, actor in history:
                log = ActivityLog(
                    campaign_id=campaign.id,
                    action_type=action_type,
                    description=description,
                    actor=actor,
                    timestamp=now
                )
                db.add(log)
            db.commit()

        print(f"Successfully seeded {len(campaigns_data)} campaigns across all 8 workflow stages!")

    finally:
        if close_session_on_exit:
            db.close()


if __name__ == "__main__":
    seed_data()
